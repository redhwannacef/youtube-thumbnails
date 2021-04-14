# Archived

I have archived this projcet as I am doing my thumbnails in Adobe Illustrator now!

# thumbnails

A small tool built with [Denojs](https://deno.land/) to generate my YouTube thumbnails. This also holds all my YouTube thumbnails in code.

The tool is quite specific to my needs, but can easily be modified to generate any style of thumbnails you want. 
For more, see the YouTube video explaining how it works: https://youtu.be/ClAsj2X_1JA

## Prerequisites

This tool uses the [Inkscape CLI](https://wiki.inkscape.org/wiki/index.php/Using_the_Command_Line) and assumes you are running this on Mac. 
If you would like to give this a go on windows, let me know, and I can have a look into it.

## Getting Started

Run `deno run --allow-write --allow-read --allow-run generate_thumbnails.ts`

## Run Tests

Run ` deno test --allow-read --allow-write --allow-run --unstable generate_thumbnails_test.ts`
