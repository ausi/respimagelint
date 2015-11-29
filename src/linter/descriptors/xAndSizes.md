# X descriptor must not be used if sizes attribute is set

## Good

```html
<img srcset="200x100.jpg 1x">
<img sizes="100vw" srcset="200x100.jpg 200w">
```

## Bad

```html
<img sizes="100vw" srcset="200x100.jpg 1x">
```

## Error template

X descriptor `{{descriptor}}` is used but the `sizes` attribute is set.
