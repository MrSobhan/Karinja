import React, { useEffect, useState } from "react";
import CardSlider from "./Slider/Slider";
import useAxios from "@/hooks/useAxios";

const RANDOM_IMAGES = [
  "https://source.unsplash.com/random/400x300?career",
  "https://source.unsplash.com/random/400x300?work",
  "https://source.unsplash.com/random/400x300?technology",
  "https://source.unsplash.com/random/400x300?office",
  "https://source.unsplash.com/random/400x300?blog",
  "https://source.unsplash.com/random/400x300?business",
  "https://source.unsplash.com/random/400x300?writing",
  "https://source.unsplash.com/random/400x300?meeting",
];

function getRandomImage(idx) {
  return RANDOM_IMAGES[idx % RANDOM_IMAGES.length];
}

function BlogCard({ post, index }) {
  return (
    <div className="w-[300px] rounded-lg shadow hover:shadow-lg border cursor-pointer bg-white flex flex-col overflow-hidden">
      <div className="h-40">
        <img
          src={getRandomImage(index)}
          alt={post.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 grow flex flex-col gap-3">
        <div className="text-xs text-blue-400 font-bold">{post.category || "دسته‌بندی"}</div>
        <div className="font-bold text-lg line-clamp-2">{post.title}</div>
        <div className="text-sm text-neutral-500 line-clamp-3">{post.summary || post.content?.substring(0, 120) || ""}</div>
      </div>
      <div className="px-4 pb-4 text-xs text-right text-muted-foreground">
        {post?.author || "نویسنده"}{/* نام نویسنده، اگر باشد */}
      </div>
    </div>
  );
}

export function SectionBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const axiosInstance = useAxios();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/blog/posts/")
      .then((res) => {
        setPosts(res.data || []);
        setError("");
      })
      .catch(() => {
        setError("خطا در دریافت پست های وبلاگ");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <CardSlider title="وبلاگ">
      {loading ? (
        <div className="p-8 text-center text-gray-500">در حال بارگذاری ...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">پستی وجود ندارد.</div>
      ) : (
        posts.map((post, idx) => <BlogCard key={post.id || idx} post={post} index={idx} />)
      )}
    </CardSlider>
  );
}
