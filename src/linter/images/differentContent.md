# Images in `srcset` attribute must not be different

The `srcset` attribute isn’t for art direction, so the images must therefore only differ in dimensions not in the image contents.

## Good

```html
<img srcset="foo-200x100.jpg 1x, foo-400x200.jpg 2x">
```

## Bad

```html
<img srcset="foo-200x100.jpg 1x, bar-400x200.jpg 2x">
```

## Error template

It seems the image *{{image1}}* doesn’t show the same contents as *{{image2}}* does, the determined difference is {{distance}}.
