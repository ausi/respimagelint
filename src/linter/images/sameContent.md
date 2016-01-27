# Images in different `<source>` elements shouldn’t be the same

The `<source>` element should only be used for art direction and format-based selection. For providing multiple resolutions of the same image use the `srcset` attribute instead.

## Good

```html
<picture> <!-- different content -->
	<source srcset="foo-200x100.jpg" media="(max-width: 600px)">
	<img src="bar-200x100.jpg">
</picture>
<picture> <!-- different aspect ratio -->
	<source srcset="foo-100x100.jpg" media="(max-width: 600px)">
	<img src="foo-200x100.jpg">
</picture>
<picture> <!-- different image type -->
	<source srcset="foo-200x100.webp" type="image/webp">
	<img src="foo-200x100.jpg">
</picture>
```

## Bad

```html
<picture> <!-- exact same source -->
	<source media="(max-width: 900px)" srcset="foo-200x100.jpg">
	<img src="foo-200x100.jpg">
</picture>
<picture> <!-- same contents, aspect ratio and format -->
	<source media="(max-width: 900px)" srcset="foo-400x200.jpg">
	<img src="foo-200x100.jpg">
</picture>
```

## Error template

It seems the image [{{image1}}]({{image1Url}}) shows the same contents as [{{image2}}]({{image2Url}}) does and it has the same aspect ratio and format.
