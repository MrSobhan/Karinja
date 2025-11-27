import React, { useEffect, useState, useRef } from "react";
import CardSlider from "./Slider/Slider";
import useAxios from "@/hooks/useAxios";
import { Link } from "react-router-dom";

// Skeleton loader with dark mode support
function BlogCardSkeleton() {
  return (
    <div className="w-[300px] h-[330px] rounded-xl shadow border bg-white dark:bg-zinc-900 flex flex-col overflow-hidden animate-pulse transition-all duration-200 relative group">
      <div className="h-40 bg-zinc-200 dark:bg-zinc-700" />
      <div className="p-4 grow flex flex-col gap-3">
        <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
      </div>
      <div className="px-4 pb-4">
        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded ml-auto" />
      </div>
    </div>
  );
}

const RANDOM_IMAGES = [
  "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
  "https://picsum.photos/400/300?random=4",
  "https://picsum.photos/400/300?random=5",
  "https://picsum.photos/400/300?random=6",
  "https://picsum.photos/400/300?random=7",
  "https://picsum.photos/400/300?random=8",
];

function getRandomImage(idx) {
  return RANDOM_IMAGES[idx % RANDOM_IMAGES.length];
}


function BlogCard({ post, index }) {
  const cardRef = useRef();
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/blog/${post.id ?? ""}`}
      ref={cardRef}
      className={`
        w-[300px] h-[330px] rounded-xl relative shadow
        cursor-pointer overflow-hidden flex flex-col justify-end
        group
        transition-all duration-300 bg-black/60
      `}
      tabIndex={0}
      aria-label={post.title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{background: "none"}}
    >
      {/* Background Image */}
      <img
        src={getRandomImage(index)}
        alt={post.title}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 ${hovered ? "scale-110" : ""}`}
        loading="lazy"
        draggable={false}
      />

      {/* Black halo overlay on hover */}
      <div
        className={`
          absolute inset-0 z-10 transition-all duration-300
          ${hovered ? "bg-black/70 backdrop-blur-sm" : "bg-black/0"}
        `}
        aria-hidden="true"
      />

      {/* Titles and author at bottom, only on hover */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-20 
          text-white px-5 py-6 flex flex-col gap-2
          items-start transition-all 
          duration-300
          ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
      >
        <div className="font-bold text-lg line-clamp-2">{post.title}</div>
        <div className="text-xs mt-1">{post?.user.full_name || "نویسنده"}</div>
      </div>
    </Link>
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
      .get("/blogs")
      .then((res) => {
        setPosts(res.data || []);
        console.log(res.data)
        setError("");
      })
      .catch(() => {
        setError("خطا در دریافت پست های وبلاگ");
      })
      .finally(() => setLoading(false));
  }, []);

  const renderSkeletons = () =>
    Array.from({ length: 4 }).map((_, idx) => <BlogCardSkeleton key={`blog-skeleton-${idx}`} />);

  return (
    <CardSlider title="وبلاگ" href="/blogs">
      {loading ? (
        <>{renderSkeletons()}</>
      ) : error ? (
        <div className="p-8 text-center text-red-500 dark:text-red-400">{error}</div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-zinc-400">پستی وجود ندارد.</div>
      ) : (
        posts.map((post, idx) => <BlogCard key={post.id || idx} post={post} index={idx} />)
      )}
    </CardSlider>
  );
}
