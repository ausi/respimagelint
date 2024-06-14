# Auto-sizes cannot be used without lazy-loading

When using `sizes="auto"` it is required to also use `loading="lazy"`.

## Good

```html
<img
	style="width: 200px"
	sizes="auto"
	loading="lazy"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
```

## Bad

```html
<img
	style="width: 200px"
	sizes="auto"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
<img
	style="width: 200px"
	sizes="auto"
	loading="eager"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
```
