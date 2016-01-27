# The `src` attribute has no effect on a `<source>` element

The `<source>` element only supports the `srcset` attribute.

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
	<source src="200x200.jpg">
	<img src="200x100.jpg">
</picture>
```
