# W descriptor doesn’t match the image size

## Good

```html
<img srcset="200x100.jpg 200w">
```

## Bad

```html
<img srcset="200x100.jpg 100w">
```

## Error template

Descriptor `{{descriptor}}` doesn’t match the image width of {{imageWidth}} from [{{image}}]({{imageUrl}}).
