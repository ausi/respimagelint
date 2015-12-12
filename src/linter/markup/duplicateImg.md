# Multiple `<img>` elements are not allowed

Only one `<img>` element is allowed inside of `<picture>`.

## Good

```html
<picture>
	<img src="200x100.jpg">
</picture>
```

## Bad

```html
<picture>
	<img src="200x100.jpg">
	<img src="200x100.jpg">
</picture>
```
