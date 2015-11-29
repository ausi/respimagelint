# Images in `srcset` attribute must not have different aspect ratios

The `srcset` attribute isn’t for art direction, so the images must therefore only differ in dimensions not in the ratio.

## Good

```html
<img srcset="200x100.jpg 200w, 400x200.jpg 400w">
```

## Bad

```html
<img srcset="200x100.jpg 200w, 400x100.jpg 400w">
```

## Error template

The image *{{image1}}* has an aspect ratio of {{ratio1}} ({{width1}}x{{height1}}) but the ratio of *{{image2}}* is {{ratio2}} ({{width2}}x{{height2}}).
