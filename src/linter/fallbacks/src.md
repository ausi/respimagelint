# Missing `src` attribute

Older browsers or other user agents which don’t understand the `srcset` attribute should get a fallback image.

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 2x">
```

## Bad

```html
<img srcset="200x100.jpg 1x, 400x200.jpg 2x">
```
