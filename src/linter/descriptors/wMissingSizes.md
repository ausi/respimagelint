# Sizes attribute must be set if W descriptors are used

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x">
<img src="200x100.jpg" srcset="200x100.jpg 200w" sizes="200px">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 200w">
```

## Error template

Descriptor `{{descriptor}}` is used but the `sizes` attribute is missing.
