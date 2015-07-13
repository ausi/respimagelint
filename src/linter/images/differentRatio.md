# Images in `srcset` attribute must not be different

The `srcset` attribute isn’t for art direction, so the images must therefore only differ in dimensions not in the ratio.

## Good

```html
<img srcset="200x100.jpg 200w, 400x200.jpg 400w">
```

## Bad

```html
<img srcset="200x100.jpg 200w, 400x100.jpg 400w">
```
