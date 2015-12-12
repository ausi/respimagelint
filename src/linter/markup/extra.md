# Only `<source>` and `<img>` tags are allowed inside of `<picture>`

You should not use `<picture>` as a wrapper to put additional elements inside it.

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
	<span>Image Caption</span>
</picture>
```

## Error template

Element `{{tags}}` was found.
