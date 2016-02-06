# X descriptor must not be used if sizes attribute is set

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x">
<img src="200x100.jpg" sizes="200px" srcset="200x100.jpg 200w">
```

## Bad

```html
<img src="200x100.jpg" sizes="100vw" srcset="200x100.jpg 1x">
```

## Error template

X descriptor `{{descriptor}}` is used but the `sizes` attribute is set.
