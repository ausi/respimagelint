# X descriptor doesn’t match the image size

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 2x">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 3x">
```

## Error template

Descriptor `{{descriptor}}` doesn’t match the image width of {{imageWidth}} from [{{image}}]({{imageUrl}}), the image should be {{correctWidth}} pixels wide or `{{correctDescriptor}}` should be used as descriptor.
