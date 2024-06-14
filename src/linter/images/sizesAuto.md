# Sizes attribute has to begin with `auto` to enable auto-sizes

If present, the keyword `auto` must be the first entry and the entire `sizes` attribute must either be `"auto"` or start with `"auto,"` as defined in the [spec](https://html.spec.whatwg.org/multipage/images.html#valdef-sizes-auto).

## Good

```html
<img
	style="width: 200px"
	sizes="auto"
	loading="lazy"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
<img
	style="width: 200px"
	sizes="auto, (min-width: 600px) 200px, 12.5em"
	loading="lazy"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
```

## Bad

```html
<img
	style="width: 200px"
	sizes="200px, auto"
	loading="lazy"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
<img
	style="width: 200px"
	sizes="(min-width: 600px) auto, 100vw"
	loading="lazy"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
<img
	style="width: 200px"
	sizes="auto , 200px"
	loading="lazy"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
```

## Error template

The use of `auto` in the `sizes` attribute `{{sizes}}` is incorrect. 

Try using `sizes="auto"` or `sizes="auto,…"` instead.
