# The `sizes` attribute has to match the width of the image

The `sizes` attribute is a hint for browsers which should tell them how large the image will be displayed. If it doesn’t match the real size, browsers cannot select the correct image source.

## Good

```html
<img
	style="width: 200px"
	sizes="200px"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
<style>
.wrong-sizes-demo-1 { width: 200px }
@media (min-width: 600px) {
	.wrong-sizes-demo-1 { width: 400px }
}
</style>
<picture>
	<source
		media="(min-width: 600px)"
		sizes="400px"
		srcset="400x400.jpg 400w, 800x800.jpg 800w"
	>
	<img
		class="wrong-sizes-demo-1"
		sizes="200px"
		srcset="200x100.jpg 200w, 400x200.jpg 400w"
		src="200x100.jpg"
	>
</picture>
```

## Bad

```html
<img
	style="width: 100%"
	sizes="200px"
	srcset="200x100.jpg 200w, 400x200.jpg 400w"
	src="200x100.jpg"
>
<picture>
	<source
		media="(min-width: 600px)"
		sizes="200px"
		srcset="200x100.jpg 200w, 400x200.jpg 400w"
	>
	<img
		style="width: 200px"
		sizes="400px"
		srcset="400x400.jpg 400w, 800x800.jpg 800w"
		src="400x400.jpg"
	>
</picture>
```

## Error template

The size of the image doesn’t match the `sizes` attribute `{{sizes}}`. At a viewport of {{viewport}} the image was {{imageWidth}} pixels wide instead of the specified {{targetWidth}} ({{difference}} difference). The affected viewports are {{viewportRanges}}.

Try using `sizes="{{sizesSuggestion}}"` instead.
