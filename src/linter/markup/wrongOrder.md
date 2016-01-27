# The `<source>` element must not appear after an `<img>` element

The `<img>` element has to be the last element inside of `<picture>`.

## Good

```html
<picture>
	<source srcset="200x200.jpg">
	<img src="200x100.jpg">
</picture>
```

## Bad

```html
<picture>
	<img src="200x200.jpg">
	<source srcset="200x100.jpg">
</picture>
```
