# Malformed descriptor

The syntax of the descriptors is defined in the [spec](https://html.spec.whatwg.org/multipage/embedded-content.html#image-candidate-string).

## Good

```html
<img srcset="200x100.jpg 1x">
<img srcset="200x100.jpg 200w">
```

## Bad

```html
<img srcset="200x100.jpg 1a">
<img srcset="200x100.jpg 100h">
```
