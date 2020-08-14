import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { exists } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

import { generateThumbnails } from "./generate_thumbnails.ts";

const noopFunction = () => {};

Deno.test("generates svgs from thumbnails", async () => {
  const tempDir = await Deno.makeTempDir({
    prefix: "deno_thumbnail_generator_test_",
  });

  const thumbnails = [
    {
      name: "a name",
      title: "a title",
      subtitle: "a subtitle",
      backgroundColour: "a colour",
      logoName: "logo.svg",
    },
  ];

  const template = "${name} ${title} ${subtitle} ${backgroundColour} ${logo}";

  await Deno.mkdir(path.join(tempDir, "resources"));
  await Deno.writeFile(
    path.join(tempDir, "resources", "logo.svg"),
    new TextEncoder().encode("a logo")
  );

  await generateThumbnails(
    thumbnails,
    template,
    path.join(tempDir, "resources"),
    path.join(tempDir, "build"),
    noopFunction
  );

  const svgOutputFile = path.join(tempDir, "build", "svg", "a name.svg");
  assertEquals(await exists(svgOutputFile), true);

  const svgOutputContent = await Deno.readTextFile(svgOutputFile);
  assertEquals(svgOutputContent, "a name a title a subtitle a colour a logo");

  await Deno.remove(tempDir, { recursive: true });
});
