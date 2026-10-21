import Image from "next/image";
import { getImageURLFromFileName } from "@/utils/paths";

import StoryMeta from "./StoryMeta";
import type { StoryPost } from "./types";

/**
 * The full bleed banner that opens a paged story. It carries the same
 * information as the header of a continuous story, just arranged differently.
 */
export default function StoryHero({ data }: { data: StoryPost }) {
    return (
        <div className="h-dvh relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-80 pt-80 mx-auto mt-24">
            <Image
                src={getImageURLFromFileName(data.image)}
                alt={data.title}
                width={1280}
                height={900}
                className="h-full w-full md:max-h-dvh my-auto absolute inset-0 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40"></div>
            <h3 className="z-10 mt-3 text-3xl font-bold text-white">
                {data.title}
            </h3>
            <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                {data.intro}
            </div>
            <div className="z-10 flex space-x-4 p-2 text-xl font-bold text-white">
                <StoryMeta data={data} variant="overlay" />
            </div>
        </div>
    );
}
