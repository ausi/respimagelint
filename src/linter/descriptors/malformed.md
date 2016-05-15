# Malformed descriptor

The syntax of the descriptors is defined in the [spec](https://html.spec.whatwg.org/multipage/embedded-content.html#image-candidate-string).

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x">
<img src="200x100.jpg" srcset="200x100.jpg 200w" sizes="200px">
```

## Bad

```html
<img src="200x100.jpg" srcset="200x100.jpg 1a">
<img src="200x100.jpg" srcset="200x100.jpg 100h">
<img src="200x100.jpg" srcset="200x100.jpg 200w 100h">
<img src="200x100.jpg" srcset="200x100.jpg 1x 200w">
<img src="200x100.jpg" srcset="200x100.jpg 200.0w">
```

## Error template

Descriptor `{{descriptor}}` is invalid.
