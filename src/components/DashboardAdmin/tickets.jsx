import React, { useEffect, useState, useRef, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LuLoaderCircle } from "react-icons/lu";
import { DataTable } from "@/components/data-table";
import AuthContext from "@/context/authContext";
import { z } from "zod";

const STATUS_OPTIONS = [
    { value: "باز", label: "باز" },
    { value: "بسته", label: "بسته" },
];

const PRIORITY_OPTIONS = [
    { value: "کم", label: "کم" },
    { value: "متوسط", label: "متوسط" },
    { value: "زیاد", label: "زیاد" },
];

const TYPE_OPTIONS = [
    { value: "سوال", label: "سوال" },
    { value: "پیشنهاد", label: "پیشنهاد" },
    { value: "انتقاد", label: "انتقاد" },
    { value: "درخواست", label: "درخواست" },
    { value: "دیگر", label: "دیگر" },
];

const ticketSchema = z.object({
    subject: z.string().min(1, "موضوع الزامی است"),
    description: z.string().min(1, "متن تیکت الزامی است"),
    answer: z.string().optional(),
    status: z.enum(["باز", "بسته"]),
    ticket_type: z.string(),
    priority: z.string(),
    requester_user_id: z.string().min(1, "ارسال کننده الزامی است"),
    receiver_user_id: z.string().optional(),
    image_url: z.string().optional(),
});

// Lightweight simple text editor for reply/message (multiline textarea)
function EditorField({ value, setValue, placeholder = "پاسخ خود را وارد کنید..." }) {
    const textareaRef = useRef(null);
    return (
        <Textarea
            ref={textareaRef}
            rows={4}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            className="mt-1"
        />
    );
}

// Ticket conversation view (Like chat)
function TicketConversation({ ticket, isAdmin, onSendAnswer, sending }) {
    const [reply, setReply] = useState("");
    const [answerDialogOpen, setAnswerDialogOpen] = useState(false);

    // Show admin (for admins) question or user's own side
    return (
        <div className="bg-muted rounded-lg p-4 my-3 flex flex-col gap-3">
            <div>
                <p>
                    <span className="font-bold min-w-20 inline-block">موضوع:</span> {ticket.subject}
                </p>
                <p>
                    <span className="font-bold min-w-20 inline-block">متن تیکت:</span> {ticket.description}
                </p>
                {ticket.image_url && (
                    <img src={ticket.image_url} alt="ضمیمه" className="mt-4 max-w-xs w-full" />
                )}
                <div className="flex gap-2 flex-row-reverse mt-2">
                    <span className="badge badge-primary">{ticket.status}</span>
                    <span className="badge badge-ghost">{ticket.priority}</span>
                    <span className="badge badge-outline">{ticket.ticket_type}</span>
                </div>
            </div>
            <hr />
            <div>
                <span className="font-semibold">پاسخ مدیر:</span>
                <div className="p-2 mt-1">
                    {ticket.answer
                        ? (
                            <div>
                                {ticket.answer}
                            </div>
                        )
                        : (
                            <span className="text-gray-400 text-sm">{isAdmin ? "هنوز پاسخی ثبت نشده" : "هنوز پاسخی دریافت نکرده اید"}</span>
                        )
                    }
                </div>
            </div>
            {isAdmin && (
                <div className="flex mt-3">
                    <Button
                        variant="outline"
                        onClick={() => setAnswerDialogOpen(true)}
                        className="mr-auto"
                    >
                        پاسخ دادن
                    </Button>
                    <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>درج پاسخ</DialogTitle>
                            </DialogHeader>
                            <EditorField value={reply} setValue={setReply} />
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => setAnswerDialogOpen(false)}
                                    disabled={sending}
                                >
                                    انصراف
                                </Button>
                                <Button
                                    onClick={async () => {
                                        await onSendAnswer(ticket, reply);
                                        setReply("");
                                        setAnswerDialogOpen(false);
                                    }}
                                    disabled={sending || !reply.trim()}
                                >
                                    ارسال
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}

// Compose Ticket Drawer/Dialog
function ComposeTicketDialog({
    open, setOpen, users, myUser, onSubmit, loading,
}) {
    // Only for users, not admin. Admin's compose could be handled here too by passing props if needed.
    const [form, setForm] = useState({
        subject: "",
        description: "",
        ticket_type: "سوال",
        priority: "متوسط",
        status: "باز",
        requester_user_id: myUser?.id ?? "",
        receiver_user_id: "", // dest user: full_admin | admin only
        image_url: "",
    });
    const [errors, setErrors] = useState({});
    const fileRef = useRef();

    useEffect(() => {
        setForm(f => ({
            ...f,
            requester_user_id: myUser?.id ?? ""
        }));
        // For user: default send to "admin" or "full_admin"
        if (users && users.length) {
            setForm(f => ({
                ...f,
                receiver_user_id: users[0].id
            }));
        }
    }, [myUser, users, open]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Just show file preview (not uploading)
    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({
                ...prev,
                image_url: URL.createObjectURL(file)
            }));
            // In real world: upload image and set backend url
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        try {
            ticketSchema.parse(form);
            onSubmit(form);
            setForm({
                subject: "",
                description: "",
                ticket_type: "سوال",
                priority: "متوسط",
                status: "باز",
                requester_user_id: myUser?.id ?? "",
                receiver_user_id: users?.[0]?.id ?? "",
                image_url: "",
            });
            setOpen(false);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errs = {};
                err.errors.forEach((zerr) => {
                    errs[zerr.path[0]] = zerr.message;
                });
                setErrors(errs);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ارسال تیکت جدید</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
                    <div>
                        <Label htmlFor="subject">موضوع</Label>
                        <Input
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className={errors.subject ? "border-red-500" : ""}
                        />
                        {errors.subject && <span className="text-red-500 text-xs">{errors.subject}</span>}
                    </div>
                    <div>
                        <Label htmlFor="description">متن پیام</Label>
                        <EditorField value={form.description} setValue={v => setForm(prev => ({ ...prev, description: v }))} />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label>اولویت</Label>
                            <Select
                                value={form.priority}
                                onValueChange={val => handleSelectChange("priority", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="انتخاب اولویت" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITY_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label>نوع</Label>
                            <Select
                                value={form.ticket_type}
                                onValueChange={val => handleSelectChange("ticket_type", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="انتخاب نوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {users && users.length > 0 && (
                        <div className="flex-1">
                            <Label>ارسال برای</Label>
                            <Select
                                value={form.receiver_user_id}
                                onValueChange={val => handleSelectChange("receiver_user_id", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="انتخاب مدیر" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.full_name} ({user.role})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div>
                        <Label>ضمیمه</Label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            className="block w-full"
                            onChange={handleImage}
                        />
                        {form.image_url && (
                            <img src={form.image_url} alt="ضمیمه" className="mt-3 max-w-[120px]" />
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            انصراف
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading && <LuLoaderCircle className="animate-spin h-4 w-4 mx-2" />}
                            ارسال
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const headers = [
    { key: "subject", label: "موضوع" },
    { key: "priority", label: "اولویت" },
    { key: "ticket_type", label: "نوع" },
    { key: "status", label: "وضعیت" },
    { key: "created_at", label: "ایجاد" },
    { key: "updated_at", label: "آخرین بروزرسانی" },
];

const Tickets = () => {
    // --- get current user (from local storage or context? for now, from access-token user object)
    const [me, setMe] = useState(null); // { id, role, ... }
    const [managerUsers, setManagerUsers] = useState([]); // Only admin, full_admin for send
    const [usersMap, setUsersMap] = useState({}); // for admin - search by id
    const axiosInstance = useAxios();

    // TABS:
    //   inbox: tickets where current user is receiver (admin), or where current user is requester (user)
    //   sent: tickets where current user is sender (requester_user_id === me.id)
    const [activeTab, setActiveTab] = useState("inbox");
    const [loading, setLoading] = useState(true);
    const [ticketsInbox, setTicketsInbox] = useState([]);
    const [ticketsSent, setTicketsSent] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [sending, setSending] = useState(false);
    const authContext = useContext(AuthContext);
    // -- Compose for Admin users
    const [composeAsAdmin, setComposeAsAdmin] = useState(false);
    const [adminTicketTargetUser, setAdminTicketTargetUser] = useState(null);

    // Current user's role
    const isAdmin = authContext.user.user_role === "admin" || authContext.user.user_role === "full_admin";

    // Fetch user profile
    useEffect(() => {
        // TODO: Replace below mock with real user state/context/auth
        const userRaw = authContext.user;
        let user = null;
        if (userRaw) {
            try {
                user = JSON.parse(userRaw);
            } catch { }
        }
        setMe(user);
    }, []);

    // Fetch admins for users to send (for "new ticket")
    const fetchAdminUsers = async () => {
        try {
            const res = await axiosInstance.get(`/users`);
            if (res.data) {
                const admins = res.data.filter(u => ["admin", "full_admin"].includes(u.role));
                setManagerUsers(admins);
                const map = {};
                res.data.forEach(u => {
                    map[u.id] = u;
                });
                setUsersMap(map);
            }
        } catch {
            setManagerUsers([]);
        }
    };


    // Fetch tickets (inbox & sent) depending on role & current tab
    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/tickets`);
            console.log(res);
            const allTickets = res.data;
            if (isAdmin) {
                setTicketsInbox(allTickets.filter(t => t.requester_user != me.user_id));
                setTicketsSent(allTickets.filter(t => t.requester_user == me.user_id));
            } else {
                const myTickets = allTickets.filter(t => t.requester_user == me.user_id);
                setTicketsInbox(myTickets);
                setTicketsSent(myTickets);
            }
        } catch {
            setTicketsInbox([]);
            setTicketsSent([]);
            toast.error("خطا در دریافت تیکت‌ها");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAdminUsers();
        fetchTickets();
    }, []);

    // SENDING TICKET (new)
    const handleCreateTicket = async (values) => {
        setSending(true);
        try {
            // "answer" not sent by default (only admin may fill on reply)
            const ticketData = {
                subject: values.subject,
                description: values.description,
                answer: "",
                status: "باز",
                ticket_type: values.ticket_type,
                priority: values.priority,
                requester_user_id: values.requester_user_id,
                receiver_user_id: values.receiver_user_id,
                image_url: values.image_url || "",
            };
            await axiosInstance.post(`/tickets/`, ticketData);
            toast.success("تیکت با موفقیت ارسال شد");
            setShowCompose(false);
            fetchTickets();
        } catch {
            toast.error("خطا در ارسال تیکت");
        }
        setSending(false);
    };

    // ADMIN responds to a ticket
    const handleAdminAnswerTicket = async (ticket, answer) => {
        setSending(true);
        try {
            await axiosInstance.patch(`/tickets/${ticket.id}`, {
                answer, status: "بسته"
            });
            toast.success("پاسخ با موفقیت ارسال شد");
            fetchTickets();
        } catch {
            toast.error("خطا در ارسال پاسخ");
        }
        setSending(false);
    };

    // admin opens dialog to send ticket to user
    const openAdminTicketDialog = (user) => {
        setComposeAsAdmin(true);
        setAdminTicketTargetUser(user);
    };

    // --- Render
    return (
        <div className="p-4" dir="rtl">
            <Toaster />
            <h1 className="text-2xl moraba font-bold mb-6">مدیریت تیکت‌ها</h1>
            {!(ticketsInbox && ticketsSent)
                ? <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
                : <>
                    <div className="flex gap-2 mb-5 items-center justify-between">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="inbox">صندوق دریافتی</TabsTrigger>
                                <TabsTrigger value="sent">ارسالی‌ها</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button onClick={() => {
                            setAdminTicketTargetUser(null);
                            setComposeAsAdmin(false);
                            setShowCompose(true);
                        }}>
                            ثبت تیکت جدید
                        </Button>
                    </div>

                    <Tabs value={activeTab}>
                        <TabsContent value="inbox">
                            {loading ? (
                                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
                            ) : (
                                <>
                                    <DataTable
                                        headers={headers}
                                        data={ticketsInbox}
                                        valueMappings={{
                                            created_at: (v) => (v ? (new Date(v)).toLocaleString("fa-IR") : ""),
                                            updated_at: (v) => (v ? (new Date(v)).toLocaleString("fa-IR") : ""),
                                            ticket_type: v => v,
                                            status: v => v,
                                            priority: v => v,
                                        }}
                                        onEdit={row => setSelectedTicket(row)}
                                        hideActions={false}
                                        onDelete={null}
                                        editLabel="مشاهده/پاسخ"
                                        deleteLabel={null}
                                    />
                                </>
                            )}
                        </TabsContent>
                        <TabsContent value="sent">
                            {loading ? (
                                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
                            ) : (
                                <>
                                    <DataTable
                                        headers={headers}
                                        data={ticketsSent}
                                        valueMappings={{
                                            created_at: (v) => (v ? (new Date(v)).toLocaleString("fa-IR") : ""),
                                            updated_at: (v) => (v ? (new Date(v)).toLocaleString("fa-IR") : ""),
                                            ticket_type: v => v,
                                            status: v => v,
                                            priority: v => v,
                                        }}
                                        onEdit={row => setSelectedTicket(row)}
                                        hideActions={false}
                                        onDelete={null}
                                        editLabel="مشاهده"
                                        deleteLabel={null}
                                    />
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </>
            }

            {/* Compose for normal users */}
            <ComposeTicketDialog
                open={showCompose}
                setOpen={setShowCompose}
                users={managerUsers}
                myUser={me}
                onSubmit={handleCreateTicket}
                loading={sending}
            />

            {/* Compose ticket as admin (send to any user) */}
            {isAdmin && composeAsAdmin && adminTicketTargetUser && (
                <ComposeTicketDialog
                    open={composeAsAdmin}
                    setOpen={setComposeAsAdmin}
                    users={[adminTicketTargetUser]}
                    myUser={me}
                    onSubmit={handleCreateTicket}
                    loading={sending}
                />
            )}

            {/* See ticket details / reply */}
            <Dialog open={!!selectedTicket} onOpenChange={v => setSelectedTicket(v ? selectedTicket : null)}>
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle>جزئیات تیکت</DialogTitle>
                    </DialogHeader>
                    {selectedTicket ? (
                        <TicketConversation
                            ticket={selectedTicket}
                            isAdmin={isAdmin && selectedTicket.status !== "بسته"}
                            onSendAnswer={handleAdminAnswerTicket}
                            sending={sending}
                        />
                    ) : null}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedTicket(null)}
                        >
                            بستن
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Tickets;