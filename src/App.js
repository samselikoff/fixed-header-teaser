import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { useEffect, useRef } from "react";
import Article from "./Article";
import Logo from "./Logo";

let scrollThreshold = [0, 50];

export default function App() {
  let { scrollY } = useViewportScroll();
  let scrollYOnDirectionChange = useRef(scrollY.get());
  let lastPixelsScrolled = useRef();
  let lastScrollDirection = useRef();
  let pixelsScrolled = useMotionValue(0);
  let height = useTransform(pixelsScrolled, scrollThreshold, [100, 60]);
  let logoHeight = useTransform(pixelsScrolled, scrollThreshold, [33, 30]);
  let backgroundOpacity = useTransform(
    pixelsScrolled,
    scrollThreshold,
    [1, 0.4]
  );
  let backgroundColorTemplate = useMotionTemplate`rgba(250 250 249 / ${backgroundOpacity})`;

  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest < 0) return;

      let isScrollingDown = scrollY.getPrevious() - latest < 0;
      let scrollDirection = isScrollingDown ? "down" : "up";
      let currentPixelsScrolled = pixelsScrolled.get();
      let newPixelsScrolled;

      if (lastScrollDirection.current !== scrollDirection) {
        lastPixelsScrolled.current = currentPixelsScrolled;
        scrollYOnDirectionChange.current = latest;
      }

      if (isScrollingDown) {
        newPixelsScrolled = Math.min(
          lastPixelsScrolled.current +
            (latest - scrollYOnDirectionChange.current),
          scrollThreshold[1]
        );
      } else {
        newPixelsScrolled = Math.max(
          lastPixelsScrolled.current -
            (scrollYOnDirectionChange.current - latest),
          scrollThreshold[0]
        );
      }

      pixelsScrolled.set(newPixelsScrolled);
      lastScrollDirection.current = scrollDirection;
    });
  }, [pixelsScrolled, scrollY]);

  return (
    <div>
      <motion.header
        style={{ height, backgroundColor: backgroundColorTemplate }}
        className="fixed inset-x-0 top-0 z-10 flex items-center shadow-sm backdrop-blur "
      >
        <div className="flex items-center justify-between w-full max-w-3xl px-4 mx-auto">
          <a href="/" className="font-semibold leading-none text-stone-900">
            <Logo style={{ height: logoHeight }} />
          </a>
        </div>
      </motion.header>

      <main className="max-w-3xl p-4 mx-auto pt-36 text-stone-700 font-serif text-lg space-y-4">
        <Article />
      </main>
    </div>
  );
}
