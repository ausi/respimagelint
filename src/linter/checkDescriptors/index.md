# Descriptors Syntax

The syntax of the descriptors is defined in the [spec](https://html.spec.whatwg.org/multipage/embedded-content.html#image-candidate-string).

## Good

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 2x">
<img src="200x100.jpg" sizes="200px" srcset="200x100.jpg 200w, 400x200.jpg 400w">
```

## {error malformed} Malformed descriptor.

```html
<img src="200x100.jpg" srcset="200x100.jpg 1a">
```

## {error no-x-sizes} X descriptor must not be used if sizes attribute is set.

```html
<img src="200x100.jpg" sizes="200px" srcset="200x100.jpg 1x">
```

## {error unique} Descriptors must be unique.

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 200x100.jpg 1x">
```

## {error mixed} X and W descriptors must not be mixed in one srcset attribute.

```html
<img src="200x100.jpg" srcset="200x100.jpg 1x, 400x200.jpg 400w">
```
