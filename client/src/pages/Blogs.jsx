import { CircleX, Rss } from "lucide-react";
import React, { useState } from "react";
import { TfiWrite } from "react-icons/tfi";

const blogs = [
  {
    id: 1,
    title: "Behind the Curtain: A Look Into Our Rehearsals",
    excerpt:
      "Peek behind the scenes at how we prepare for our annual productions...",
    content: `
Rehearsals are where the magic begins long before the spotlight hits the stage. Every year, weeks before our major productions, our team enters a creative cocoon—one filled with energy, nerves, and endless possibilities.

## The Warm-up Ritual

Each session starts with our signature warm-up routine. From breathing exercises to vocal stretches, these rituals help cast members shake off the day's stress and ground themselves in the present moment.

> "The stage demands your body and soul. Our warm-ups remind us we're more than performers—we're storytellers." — Aarav Kapoor

## Blocking & Movement

Blocking is more than just stage direction. It's choreography with emotion. Every step, every pause, is carefully placed to convey meaning and maintain audience engagement.

- Actors rehearse their entrances and exits repeatedly.
- Timing is adjusted with stage lighting to create emphasis.
- Feedback is constant—directors and peers help shape each moment.

## Building Chemistry

Ensemble exercises help build trust and familiarity between cast members. Whether it's improv games or partner reflections, they foster the emotional glue needed to portray deep relationships on stage.

## Rehearsing With Tech

Our backstage team begins integrating sound cues, lighting effects, and set transitions halfway through rehearsals. This overlap ensures that performers and crew can sync their rhythms and deliver a seamless performance.

## Final Thoughts

Rehearsals are not just about memorizing lines. They’re about becoming the character, absorbing the narrative, and building something magical together. They’re where the cast becomes family, and where a story begins to breathe.

The audience may only see the final act—but everything they feel begins here: behind the curtain.
    `.trim(),
    author: "Ananya Verma",
    date: "2025-07-25",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmDpdESZq-3Wpj65-s4kbDNMSKFbW5eJUY2Q&s",
  },
  {
    id: 2,
    title: "The Power of Expression Through Stage",
    excerpt:
      "Acting is not just performance—it’s therapy, rebellion, and storytelling...",
    content:
      "Acting is not just performance—it’s therapy, rebellion, and storytelling. From our first-year students to our seniors, here’s how drama has become a safe space for emotional expression.",
    author: "Rohan Mehta",
    date: "2025-07-18",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s",
  },
  {
    id: 3,
    title: "5 Tips to Overcome Stage Fear",
    excerpt: "Stage fear is real—but beatable...",
    content:
      "Here are 5 real and practical tips that helped our members overcome stage fear: breathing control, mock rehearsals, backstage meditation, visualization, and confidence coaching.",
    author: "Meera Shah",
    date: "2025-07-10",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNAkB1j2W0ejEMyWFYmTpvMoKYCzy99XwD_Q&s",
  },
];

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <div className="bg-black min-h-screen pt-30 pb-20 px-6 md:px-20 text-white">
      <h2 className="flex flex-row gap-4 items-center justify-center text-4xl lg:text-6xl text-yellow-500 text-center mb-12">
        <Rss className="text-white size-10" />
        Blogs
      </h2>

      <p className="text-white text-center text-lg mb-12">
        Stories, scripts, and society snapshots — dive into the drama behind the
        scenes.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-zinc-950 border border-yellow-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedBlog(blog)}
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6 space-y-3">
              <p className="text-sm text-yellow-400 font-medium">
                {new Date(blog.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h3 className="text-xl font-semibold hover:underline">
                {blog.title}
              </h3>
              <p className="text-gray-300 text-sm">{blog.excerpt}</p>
              <p className="text-sm italic text-yellow-200 mt-2">
                — {blog.author}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* read blogs popup */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-zinc-950 text-white max-w-2xl w-full rounded-lg p-6 relative shadow-lg border border-yellow-500/30 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute cursor-pointer top-2 right-2 text-white text-xl font-bold hover:text-yellow-500"
              onClick={() => setSelectedBlog(null)}
            >
              <CircleX size={30} />
            </button>
            <img
              src={selectedBlog.image}
              className="w-full h-60 object-cover rounded"
              alt={selectedBlog.title}
            />
            <h2 className="text-2xl font-bold mt-4">{selectedBlog.title}</h2>
            <p className="text-sm text-yellow-400 mb-2 whitespace-pre-wrap">
              {new Date(selectedBlog.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              | By {selectedBlog.author}
            </p>
            <p className="text-gray-300 mt-4">{selectedBlog.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
