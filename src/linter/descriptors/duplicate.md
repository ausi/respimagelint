# Descriptors must be unique

## Good

```html
<img srcset="200x100.jpg 1x, 400x200.jpg 2x">
<img srcset="200x100.jpg 200w, 400x200.jpg 400w">
```

## Bad

```html
<img srcset="200x100.jpg, 400x200.jpg 1x">
<img srcset="200x100.jpg 1x, 400x200.jpg 1x">
<img srcset="200x100.jpg 200w, 400x200.jpg 200w">
```
