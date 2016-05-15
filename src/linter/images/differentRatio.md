# Images in `srcset` attribute must not have different aspect ratios

The `srcset` attribute isn’t for art direction, so the images must therefore only differ in dimensions not in the ratio.

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 200w, 400x200.jpg 400w" sizes="200px">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 200w, 400x100.jpg 400w" sizes="200px">
```

## Error template

The image [{{image1}}]({{image1Url}}) has an aspect ratio of {{ratio1}} ({{image1Width}}x{{image1Height}}) but the ratio of [{{image2}}]({{image2Url}}) is {{ratio2}} ({{image2Width}}x{{image2Height}}).
