import * as path from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { exec } from "https://deno.land/x/exec/mod.ts";

export interface Thumbnail {
  name: string;
  title: string;
  subtitle: string;
  backgroundColour: string;
  logoName: string;
}

export const generateThumbnails = async (
  thumbnails: Thumbnail[],
  template: string,
  resourcesDir: string,
  outputDir: string,
  convertToPng: (svgPaths: string[], outputDir: string) => void
): Promise<void> => {
  await Deno.mkdir(path.join(outputDir, "svg"), { recursive: true });

  for (const thumbnail of thumbnails) {
    const { name, title, backgroundColour, subtitle, logoName } = thumbnail;
    const logo = await Deno.readTextFile(path.join(resourcesDir, logoName));
    const evaluatedTemplate = eval(`\`${template}\``);
    await Deno.writeFile(
      path.join(outputDir, "svg", `${name}.svg`),
      new TextEncoder().encode(evaluatedTemplate)
    );
  }

  const svgPaths = thumbnails.map((thumbnail) =>
    path.join(outputDir, "svg", `${thumbnail.name}.svg`)
  );

  await convertToPng(svgPaths, outputDir);
};

const {
  "thumbnails-file": thumbnailsFile = "thumbnails.json",
  "template-file": templateFile = "template.svg",
  "resources-dir": resourcesDir = "resources",
  "output-dir": outputDir = "build",
} = parse(Deno.args);

const thumbnails: Thumbnail[] = JSON.parse(
  await Deno.readTextFile(path.resolve(thumbnailsFile))
);

const template = await Deno.readTextFile(path.resolve(templateFile));

const convertToPng = async (svgPaths: string[], outputDir: string) => {
  const svgsString = svgPaths.join(" ");
  await exec(
    `/Applications/Inkscape.app/Contents/MacOS/inkscape --export-type=png ${svgsString}`
  );

  await Deno.mkdir(path.join(outputDir, "png"), { recursive: true });
  for (const thumbnail of thumbnails) {
    await Deno.rename(
      path.join(outputDir, "svg", `${thumbnail.name}.png`),
      path.join(outputDir, "png", `${thumbnail.name}.png`)
    );
  }
};

await generateThumbnails(
  thumbnails,
  template,
  path.resolve(resourcesDir),
  path.resolve(outputDir),
  convertToPng
);
