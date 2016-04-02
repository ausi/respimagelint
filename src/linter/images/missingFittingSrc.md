# A fitting image source should be available for all screen sizes

Loading a large image and display it much smaller should be avoided to save bandwidth. Loading a small image and display it much larger should be avoided to prevent pixelated artifacts.

## Good

```html
<img style="width: 200px" src="200x100.jpg">
<img
	style="width: 100%"
	src="200x100.jpg"
	srcset="200x100.jpg 200w, 400x200.jpg 400w, 800x400.jpg 800w, 1600x800.jpg 1600w, 2000x1000.jpg 2000w"
	sizes="100vw"
>
```

## Bad

```html
<img style="width: 100%" src="200x100.jpg">
<img
	style="width: 100%"
	src="200x100.jpg"
	srcset="200x100.jpg 200w, 4000x2000.jpg 4000w"
	sizes="100vw"
>
```

## Error template

At a viewport width of {{viewWidth}} the image was displayed {{imageWidth}} pixels wide, but the closest provided image has a width of {{nearbyWidth}} which is {{distance}} off. The affected viewport widths are {{viewportRanges}}.
