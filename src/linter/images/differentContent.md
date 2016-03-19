# Images in `srcset` attribute must not be different

The `srcset` attribute isn’t for art direction, so the images must therefore only differ in dimensions not in the image contents.

## Good

```html
<img src="cat-200x100.jpg" srcset="cat-200x100.jpg 1x, cat-400x200.jpg 2x">
```

## Bad

```html
<img src="cat-200x100.jpg" srcset="cat-200x100.jpg 1x, dog-400x200.jpg 2x">
```

## Error template

It seems the image [{{image1}}]({{image1Url}}) doesn’t show the same contents as [{{image2}}]({{image2Url}}) does, the determined difference is {{distance}}.
