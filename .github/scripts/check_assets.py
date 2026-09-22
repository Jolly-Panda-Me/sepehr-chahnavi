"""Fails the build if data/content.json points at an image that isn't in the repo."""
import json, pathlib, sys

content = json.load(open("data/content.json", encoding="utf-8"))

paths = set()
paths.add(content["site"]["ogImage"])
paths.add(content["site"]["logo"])
paths.add(content["site"]["favicon32"])
paths.add(content["site"]["favicon180"])

for lang in ("en", "fa"):
    block = content.get(lang, {})
    about_image = block.get("about", {}).get("image")
    if about_image:
        paths.add(about_image)
    for item in block.get("projects", {}).get("items", []):
        if item.get("image"):
            paths.add(item["image"])

missing = sorted(p for p in paths if p and not pathlib.Path(p).exists())
if missing:
    print("missing image files:")
    for m in missing:
        print("  " + m)
    sys.exit(1)
print(f"ok  all {len(paths)} referenced images exist")
