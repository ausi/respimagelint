# W or H descriptor doesn’t match the image size

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 200w">
<img src="200x100.jpg" srcset="200x100.jpg 200w 100h">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 100w">
<img src="200x100.jpg" srcset="200x100.jpg 200w 200h">
```

## Error template

Descriptor `{{descriptor}}` doesn’t match the image size of {{imageSize}} from [{{image}}]({{imageUrl}}).
