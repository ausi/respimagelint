# X and W descriptors must not be mixed in one srcset attribute

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 2x">
<img src="200x100.jpg" srcset="200x100.jpg 200w, 400x200.jpg 400w" sizes="200px">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 400w">
<img src="200x100.jpg" srcset="200x100.jpg, 400x200.jpg 400w">
```

## Error template

X and W descriptors are mixed: `{{descriptors}}`.
