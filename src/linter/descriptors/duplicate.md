# Descriptors must be unique

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 2x">
<img src="200x100.jpg" srcset="200x100.jpg 200w, 400x200.jpg 400w" sizes="200px">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg, 400x200.jpg 1x">
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 1x">
<img src="200x100.jpg" srcset="200x100.jpg 200w, 400x200.jpg 200w">
```

## Error template

The descriptor {{descriptor}} appears twice in the same `srcset` attribute ([{{image1}}]({{image1Url}}) and [{{image2}}]({{image2Url}})).
