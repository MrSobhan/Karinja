import React, { useEffect, useState, useRef, useContext } from "react";
import useAxios from "@/hooks/useAxios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LuLoaderCircle } from "react-icons/lu";
import { SiAnswer } from "react-icons/si";
import { DataTable } from "@/components/data-table";
import AuthContext from "@/context/authContext";
import { z } from "zod";

function toJalaliString(date) {
    if (!date) return "";
    return new Date(date).toLocaleString("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

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
    requester_user_id: z.string(),
    image_url: z.string().optional(),
});

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

function TicketConversation({
    ticket,
    isInbox,
    onSendAnswer,
    sending,
    onEdit,
    canEdit,
}) {
    const [reply, setReply] = useState("");
    const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority,
        ticket_type: ticket.ticket_type,
    });
    const [editErrors, setEditErrors] = useState({});

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSave = async () => {
        setEditErrors({});
        try {
            ticketSchema.parse({ ...ticket, ...editForm });
            await onEdit(ticket, editForm); // call parent
            setEditMode(false);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errs = {};
                err.errors.forEach((zerr) => {
                    errs[zerr.path[0]] = zerr.message;
                });
                setEditErrors(errs);
            }
        }
    };

    return (
        <div className="rounded-lg p-4 my-3 flex flex-col gap-3">
            {!editMode ? (
                <>
                    <div>
                        <p>
                            <span className="min-w-20 inline-block">موضوع:</span> {ticket.subject}
                        </p>
                        <p>
                            <span className="min-w-20 inline-block">متن تیکت:</span> {ticket.description}
                        </p>
                        {ticket.image_url && (
                            <img src={ticket.image_url} alt="ضمیمه" className="mt-4 max-w-xs w-full" />
                        )}
                        <div className="flex gap-2 my-3 items-center">
                            <Badge variant="default" className="flex items-center gap-1" title="وضعیت تیکت">
                                <span className="font-bold">وضعیت:</span>
                                {ticket.status}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1" title="اولویت تیکت">
                                <span className="font-bold">اولویت:</span>
                                {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1" title="نوع تیکت">
                                <span className="font-bold">نوع:</span>
                                {ticket.ticket_type}
                            </Badge>
                        </div>
                        <div className="mt-2 text-gray-400 text-xs">
                            <span className="">تاریخ ایجاد: </span>
                            {toJalaliString(ticket.created_at)}
                        </div>
                    </div>
                    <hr />
                    <div>
                        <span className="font-semibold">پاسخ:</span>
                        <div className="p-2 mt-1">
                            {ticket.answer ?
                                <div>{ticket.answer}</div>
                                :
                                <span className="text-gray-400 text-sm">
                                    هنوز پاسخی ثبت نشده
                                </span>
                            }
                        </div>
                    </div>
                    {isInbox && (
                        <div className="flex mt-3">
                            <Button
                                variant="outline"
                                onClick={() => setAnswerDialogOpen(true)}
                                className="mr-auto bg-black text-white dark:bg-white dark:text-black border-gray-300 dark:border-gray-600 "
                            >
                                <SiAnswer /> پاسخ به تیکت
                            </Button>
                            <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>پاسخ به تیکت</DialogTitle>
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
                            {canEdit && (
                                <Button
                                    variant="outline"
                                    className="ml-2 mr-2"
                                    onClick={() => setEditMode(true)}
                                >
                                    ویرایش
                                </Button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <div>
                        <Label>موضوع</Label>
                        <Input
                            name="subject"
                            value={editForm.subject}
                            onChange={handleEditChange}
                            className={editErrors.subject ? "border-red-500" : ""}
                        />
                        {editErrors.subject && (
                            <span className="text-red-500 text-xs">{editErrors.subject}</span>
                        )}
                    </div>
                    <div className="mt-3">
                        <Label>متن تیکت</Label>
                        <Textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            className={editErrors.description ? "border-red-500" : ""}
                        />
                        {editErrors.description && (
                            <span className="text-red-500 text-xs">{editErrors.description}</span>
                        )}
                    </div>
                    <div className="flex gap-3 mt-3">
                        <div className="flex-1">
                            <Label>اولویت</Label>
                            <Select
                                value={editForm.priority}
                                onValueChange={val =>
                                    setEditForm((prev) => ({ ...prev, priority: val }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="انتخاب اولویت" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITY_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label>نوع</Label>
                            <Select
                                value={editForm.ticket_type}
                                onValueChange={val =>
                                    setEditForm((prev) => ({ ...prev, ticket_type: val }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="انتخاب نوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="mt-3">
                        <Button
                            variant="outline"
                            onClick={() => setEditMode(false)}
                        >
                            انصراف
                        </Button>
                        <Button
                            onClick={handleEditSave}
                        >
                            ذخیره
                        </Button>
                    </DialogFooter>
                </div>
            )}
        </div>
    );
}

function ComposeTicketDialog({
    open,
    setOpen,
    users,
    myUser,
    onSubmit,
    loading,
}) {
    
    const [form, setForm] = useState({
        subject: "",
        description: "",
        ticket_type: "سوال",
        priority: "متوسط",
        status: "باز",
        requester_user_id: myUser?.user_id ?? "",
        image_url: "",
        file: null,
    });
    const [errors, setErrors] = useState({});
    const fileRef = useRef();

    useEffect(() => {
        setForm((f) => ({
            ...f,
            requester_user_id:
                users && users.length > 0 ? users[0].id : myUser?.id ?? "",
        }));
    }, [myUser, users, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm((prev) => ({
                ...prev,
                image_url: URL.createObjectURL(file),
                file: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        

        try {
            ticketSchema.parse(form);
            let submissionData = {
                subject: form.subject,
                description: form.description,
                ticket_type: form.ticket_type,
                priority: form.priority,
                status: form.status,
                requester_user_id: myUser?.user_id,
                answer: "",
            };


            if (form.file) {
                const fd = new FormData();
                Object.entries(submissionData).forEach(([key, val]) => {
                    fd.append(key, val);
                });
                fd.append("image", form.file);
                await onSubmit(fd, true);
            } else {
                await onSubmit(submissionData, false);
                
            }

            setForm({
                subject: "",
                description: "",
                ticket_type: "سوال",
                priority: "متوسط",
                status: "باز",
                requester_user_id:
                    users && users.length > 0 ? users[0].id : myUser?.id ?? "",
                image_url: "",
                file: null,
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
                                value={form.requester_user_id}
                                onValueChange={val => handleSelectChange("requester_user_id", val)}
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
                    {/* <div>
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
                    </div> */}
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

const ticketsHeaders = [
    { key: "subject", label: "موضوع" },
    { key: "priority", label: "اولویت" },
    { key: "ticket_type", label: "نوع" },
    { key: "status", label: "وضعیت" },
    {
        key: "created_at",
        label: "تاریخ ایجاد",
        render: (cellValue) => {
            try {
                if (!cellValue) return "-";
                if (typeof PersianCalendar === "function") {
                    return PersianCalendar(cellValue);
                }
                return new Intl.DateTimeFormat("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }).format(new Date(cellValue));
            } catch (e) {
                return cellValue;
            }
        }
    }
];

const Tickets = () => {
    const [me, setMe] = useState(null);
    const [managerUsers, setManagerUsers] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const axiosInstance = useAxios();

    const [activeTab, setActiveTab] = useState("inbox");
    const [loading, setLoading] = useState(true);
    const [ticketsInbox, setTicketsInbox] = useState([]);
    const [ticketsSent, setTicketsSent] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [sending, setSending] = useState(false);
    const authContext = useContext(AuthContext);

    // Parse user profile correctly from context (fix context usage and normalization)
    useEffect(() => {
        let userRaw = authContext?.user;
        let user = null;
        // handle both string and object
        if (typeof userRaw === "string") {
            try {
                user = JSON.parse(userRaw);
            } catch {
                user = null;
            }
        } else if (typeof userRaw === "object" && userRaw) {
            user = userRaw;
        }
        setMe(user);
    }, [authContext?.user]);

    // Fetch admins for users to send (for "new ticket")
    const fetchAdminUsers = async () => {
        try {
            const res = await axiosInstance.get(`/users`);
            if (res.data) {
                const admins = res.data.filter((u) =>
                    ["admin", "full_admin"].includes(u.role)
                );
                setManagerUsers(admins);
                const map = {};
                res.data.forEach((u) => {
                    map[u.id] = u;
                });
                setUsersMap(map);
            }
        } catch {
            setManagerUsers([]);
        }
    };

    // Fetch tickets (fix logic for filtering!)
    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/tickets`);
            const allTickets = res.data;
            if (!me) {
                setTicketsInbox([]);
                setTicketsSent([]);
                setLoading(false);
                return;
            }
            console.log(allTickets);
            
            const myId = me.user_id;
            setTicketsInbox(
                allTickets.filter((t) => t.requester_user.id != myId)
            );
            setTicketsSent(
                allTickets.filter((t) => t.requester_user.id == myId)
            );
        } catch (err){
            
            setTicketsInbox([]);
            setTicketsSent([]);
            toast.error("خطا در دریافت تیکت‌ها");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAdminUsers();
    }, []);

    useEffect(() => {
        if (me) fetchTickets();
    }, [me]);

    const handleCreateTicket = async (values, isFormData = false) => {        
        setSending(true);
        try {
            let res;
            if (isFormData) {
                res = await axiosInstance.post(`/tickets`, values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                res = await axiosInstance.post(`/tickets`, {
                    ...values,
                });
            }
            toast.success("تیکت با موفقیت ارسال شد");
            setShowCompose(false);
            fetchTickets();
        } catch (err) {
            if (
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                toast.error(
                    "خطا در ارسال تیکت: " + err.response.data.message
                );
            } else {
                toast.error("خطا در ارسال تیکت");
            }
        }
        setSending(false);
    };

    const handleSendAnswer = async (ticket, answer) => {
        setSending(true);
        try {
            await axiosInstance.patch(`/tickets/${ticket.id}`, {
                answer,
                status: "بسته شد",
            });

            toast.success("پاسخ شما ثبت شد");
            fetchTickets();
        } catch {
            toast.error("خطا در ارسال پاسخ");
        }
        setSending(false);
    };

    const handleDeleteTicket = async (ticket) => {
        if (
            !window.confirm(
                "آیا مطمئنید که می‌خواهید این تیکت را حذف کنید؟"
            )
        )
            return;
        setSending(true);
        try {
            await axiosInstance.delete(`/tickets/${ticket.id}`);
            toast.success("تیکت حذف شد");
            fetchTickets();
        } catch {
            toast.error("خطا در حذف تیکت");
        }
        setSending(false);
        setSelectedTicket(null);
    };

    const handleEditTicket = async (ticket, newData) => {
        setSending(true);
        try {
            await axiosInstance.patch(`/tickets/${ticket.id}`, {
                ...newData,
            });
            toast.success("تیکت با موفقیت ویرایش شد");
            fetchTickets();
        } catch {
            toast.error("خطا در ویرایش تیکت");
        }
        setSending(false);
        setSelectedTicket((t) => ({ ...t, ...newData }));
    };

    return (
        <div className="p-4" dir="rtl">
            <Toaster className="dana"/>
            <h1 className="text-2xl moraba font-bold mb-6">مدیریت تیکت‌ها</h1>
            {loading ? (
                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
            ) : (
                <>
                    <div className="flex gap-2 mb-5 items-center justify-between">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="inbox">
                                    صندوق دریافتی
                                </TabsTrigger>
                                <TabsTrigger value="sent">
                                    صندوق ارسالی‌
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button
                        className={`${activeTab == "inbox" ? 'hidden' : ''}`}
                            onClick={() => {
                                setShowCompose(true);
                            }}
                        >
                            ثبت تیکت جدید
                        </Button>
                    </div>

                    <Tabs value={activeTab}>
                        <TabsContent value="inbox">
                            {loading ? (
                                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
                            ) : (
                                <DataTable
                                    headers={ticketsHeaders}
                                    data={ticketsInbox}
                                    valueMappings={{
                                        created_at: (v) => v,
                                        ticket_type: (v) => v,
                                        status: (v) => v,
                                        priority: (v) => v,
                                    }}
                                    onEdit={(row) => setSelectedTicket(row)}
                                    onDelete={handleDeleteTicket}
                                    hideActions={false}
                                    editLabel="مشاهده/پاسخ"
                                    deleteLabel="حذف"
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="sent">
                            {loading ? (
                                <LuLoaderCircle className="animate-spin h-8 w-8 mx-auto mt-10 text-black dark:text-white" />
                            ) : (
                                <DataTable
                                    headers={ticketsHeaders}
                                    data={ticketsSent}
                                    valueMappings={{
                                        created_at: (v) => v,
                                        ticket_type: (v) => v,
                                        status: (v) => v,
                                        priority: (v) => v,
                                    }}
                                    onEdit={(row) => setSelectedTicket(row)}
                                    onDelete={handleDeleteTicket}
                                    hideActions={false}
                                    editLabel="مشاهده"
                                    deleteLabel="حذف"
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </>
            )}

            <ComposeTicketDialog
                open={showCompose}
                setOpen={setShowCompose}
                users={managerUsers}
                myUser={me}
                onSubmit={handleCreateTicket}
                loading={sending}
            />

            <Dialog
                open={!!selectedTicket}
                onOpenChange={(v) =>
                    setSelectedTicket(v ? selectedTicket : null)
                }
            >
                <DialogContent className="sm:max-w-[460px]">
                    <DialogHeader>
                        <DialogTitle>جزئیات تیکت</DialogTitle>
                    </DialogHeader>
                    {selectedTicket ? (
                        <TicketConversation
                            ticket={selectedTicket}
                            isInbox={
                                ticketsInbox.find(
                                    (t) => t.id === selectedTicket.id
                                ) !== undefined
                            }
                            onSendAnswer={handleSendAnswer}
                            sending={sending}
                            onEdit={handleEditTicket}
                            canEdit={
                                ticketsSent.find(
                                    (t) => t.id === selectedTicket.id
                                ) !== undefined
                            }
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Tickets;