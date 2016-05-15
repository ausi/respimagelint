# W descriptor doesn’t match the image size

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 200w" sizes="200px">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 100w" sizes="200px">
```

## Error template

Descriptor `{{descriptor}}` doesn’t match the image size of {{imageSize}} from [{{image}}]({{imageUrl}}).
