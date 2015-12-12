# The `<img>` element must not be omitted inside of `<picture>`

The `<picture>` element needs an `<img>` element in order to display something.

## Good

```html
<picture>
	<img src="200x100.jpg">
</picture>
```

## Bad

```html
<picture>
	<source srcset="200x100.jpg">
</picture>
```
