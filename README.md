# amp-up.io QTI 3 Stimulus Player Component

<div id="top"></div>

[![MIT License][license-shield]][license-url]

The amp-up.io QTI 3 Stimulus Player Component ("QTI 3 Stimulus Player") is a 100% JavaScript component that aims to encapsulate the best practices and behaviors of the IMS Global QTI 3 Assessment Stimulus specification.  A conforming QTI 3 authoring or exporting system can construct a QTI 3 Assessment Stimulus XML solution that will "play" authentically and reliably in the QTI 3 Stimulus Player - according to the Best Practices Implementation Guide which can be found here:

[IMS Global QTI v3 Best Practices and Implementation Guide](https://www.imsglobal.org/spec/qti/v3p0/impl)

The QTI 3 Stimulus Player supports all three sub-elements permitted in a qti-assessment-stimulus which are:

* qti-stylesheet
* qti-stimulus-body
* qti-catalog-info



## About The Project

The QTI 3 Stimulus Player has API's, interfaces, and capabilities which are optimized for formative or classroom assessment settings.  Such settings typically require sophisticated QTI features such as adaptive items, item templating (sometimes called item "cloning"), template processing, and full response processing; i.e., scoring.  The QTI 3 Stimulus Player implements the full expressive QTI 3 Assessment Stimulus XML vocabulary according to best practices - including support for qti-catalog-info and Personal Needs and Preferences.  Consequently, you don't have to know anything about QTI.  Just install the component in your project, inject XML, and go!  

<div align="center">
  <p><b>Thumbnails of Stimulus Rendering</b></p>
</div>

<p align="right">(<a href="#top">back to top</a>)</p>



## Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/amp-up-io/qti3-stimulus-player.git
```

### 2. Installation
```sh
npm install
```

### 3. Compiles and hot-reloads for development
```sh
npm run serve
```

### 4. Compiles, minifies, creates package
```sh
npm run build:npm
```

<p align="right">(<a href="#top">back to top</a>)</p>



## Usage

### 1. Import QTI 3 Item Player CSS

The Qti 3 Stimulus Player contains a dependency on Qti3Player (the Item player) in order to access the built-in shared CSS.

```js
// The Qti3Player built-in CSS
import 'qti3-item-player/dist/qti3Player.css'
```
<p align="right">(<a href="#top">back to top</a>)</p>


### 2. Load the QTI 3 Stimulus Player component into your Page or Template

```html
<Qti3StimulusPlayer
  ref="qti3Stimulusplayer"
  :container-class="containerClass"
  :container-padding-class="containerPaddingClass"
  :color-class="colorClass"
  @notifyQti3StimulusPlayerReady="handleStimulusPlayerReady"
  @notifyQti3StimulusReady="handleStimulusReady"
  @notifyQti3StimulusCatalogEvent="handleStimulusCatalogEvent"
/>
```
<p align="right">(<a href="#top">back to top</a>)</p>


### 3. Listen for the QTI 3 Stimulus Player 'notifyQti3StimulusPlayerReady' event

This event signifies that the QTI 3 Stimulus Player component is loaded and ready for action.  The following snippet is a sample handler for the `notifyQti3StimulusPlayerReady` event.  QTI 3 Stimulus Player hands itself as an argument to the `notifyQti3StimulusPlayerReady` event, thus simplifying further QTI 3 Stimulus Player API calls.

```js
/**
 * @description Event handler for the QTI3StimulusPlayer component's 'notifyQti3StimulusPlayerReady'
 * event.  This event is fired upon mounting of the Qti3StimulusPlayer component.
 *
 * The Qti3StimulusPlayer is now ready for XML loading.
 * @param {Component} qti3StimulusPlayer - the Qti3StimulusPlayer component itself
 */
handleStimulusPlayerReady (qti3StimulusPlayer) {
  this.qti3StimulusPlayer = qti3StimulusPlayer
}
```
<p align="right">(<a href="#top">back to top</a>)</p>


### 4. Load a QTI 3 qti-assessment-stimulus into QTI 3 Stimulus Player

After QTI 3 Stimulus Player is loaded and ready (see #3 above), QTI 3 Stimulus XML can be loaded directly into QTI 3 Stimulus Player via the Player's `loadStimulusFromXML` method which takes two arguments `xml {String}` and `configuration {Object}`.  

```js
// Load qti-assessment-stimulus XML with a configuration.  Use the 'this.qti3StimulusPlayer' reference
// saved in the notifyQti3StimulusPlayerReady event handler.
this.qti3StimulusPlayer.loadStimulusFromXml(xml, configuration)
```

#### 4a) About a Configuration

The `configuration` object is used to specify runtime context to QTI 3 Stimulus Player during the stimulus session loaded in `loadStimulusFromXml`.  A configuration object has the following structure:

```js
configuration: {
  guid: <{String} identifier used to track item state>,
  pnp: <{Object} used to define Personal Needs and Preferences>,
  sessionControl: null // ignored
}
```

#### 4b) Constructing a Configuration

The following snippet is an example of how an application can construct a `configuration`.

```js
// Intialize
const configuration = {}

// Stamp a stimulus' tracking guid (if any) onto the configuration
configuration.guid = myItemTrackingGuid

// QTI 3 Stimulus Player includes a helper class called 'PnpFactory' which can be used
// to build a Personal Needs and Preferences definition.
// The Default pnp object in the PnpFactory is:
const pnp = {
  textAppearance: {
    colorStyle: 'qti3-player-color-default'
  },
  // Glossary is universal support turned on (true) by default
  glossaryOnScreen: true,
  // Keyword translation is off ('') by default
  keywordTranslationLanguage: '',
  // Custom SBAC Illustrated Glossary is off (false) by default
  extSbacGlossaryIllustration: false,
  layoutSingleColumn: false // unsupported - see Roadmap (Simplified Layout)
}

// Set the configuration's 'pnp' property
configuration.pnp = pnp

// Session Control is ignored by QTI 3 Stimulus Player.
configuration.sessionControl = null
 ```

In the absence of a `pnp` property, QTI 3 Stimulus Player will use defaults, or previous settings, for presentation and accessibility supports.  The `sessionControl` property is ignored by QTI 3 Stimulus Player.

<p align="right">(<a href="#top">back to top</a>)</p>


### 5. Listen for the QTI 3 Stimulus Player 'notifyQti3StimulusReady' Event

QTI 3 Stimulus Player triggers a `notifyQti3StimulusReady` event upon completion of the Player's `loadStimulusFromXML` method.  The following snippet is a sample handler for the `notifyQti3StimulusReady` event.

```js
/**
 * @description Event handler for the Qti3StimulusPlayer component's 'notifyQti3StimulusReady'
 * event.  This event is fired upon completion of the qti-assessment-stimulus
 * component's loading of XML.
 */
handleStimulusReady () {
  console.log('QTI 3 Stimulus XML is loaded and rendered!')
}
```
<p align="right">(<a href="#top">back to top</a>)</p>


### 6. Stimulus 'Catalog' Events

A stimulus 'catalog' event is triggered by QTI 3 Stimulus Player when a user selects a control (such as a highlighted term) within the stimulus' presentation that is bound to a stimulus' catalog.  QTI 3 Stimulus Player will display its own Catalog Dialog component when a user selects a control within the stimulus' presentation that is bound to glossary, keyword translation, and custom `ext:sbac-glossary-illustration` events.


<div align="center">
  <p><b>Example of QTI 3 Stimulus Player Glossary Dialog</b></p>
<img src="https://user-images.githubusercontent.com/898605/161848852-6cec8b3d-f843-403c-a651-99b284946f65.png" width="260" height="240">
</div>


An encapsulating application may instrument the QTI 3 Stimulus Player to _not display its internal Catalog Dialog component_ by specifying the boolean attribute `suppress-catalog-messages`.  When instrumenting QTI 3 Stimulus Player to suppress its internal catalog message display, an application should implement a handler for the `notifyQti3StimulusCatalogEvent`.  This permits an application to handle and display catalog event messages using its own UX.  Example:

```html
<Qti3StimulusPlayer
  ref="qti3Stimulusplayer"
  suppress-catalog-messages
  @notifyQti3StimulusCatalogEvent="handleStimulusCatalogEvent"
/>
```

```js
    /**
     * @description Handler for QTI stimulus catalog events such as 'glossary' events.
     * @param {Object} event - object containing a catalog event payload
     * Sample event schema:
     * {
     *   type: "glossary",
     *   term: "acronym",
     *   catalogIdRef: "glosscat",
     *   data: [
     *     {
     *       support: "glossary-on-screen",
     *       card: {
     *         content: ""<p>An abbreviation.</p>"",
     *         properties: {
     *           name: "qti-html-content"
     *         }
     *       }
     *     }
     *     ... additional Card supports in Catalog based on PNP ...
     *   ]
     * }
     */
    handleStimulusCatalogEvent (event) {
      console.log('[StimulusCatalogEvent][Type: ' + event.type + ']', event)
      switch (event.type) {
        case 'glossary':
          // Do something!
          break
        default:
      }
    },
```

#### Supported Keyword Translation Language Codes ####

QTI 3 Stimulus Player groups PNP 'glossary-on-screen', 'keyword-translation', and 'ext:sbac-glossary-illustration' supports into 'glossary' events that will trigger a Catalog event of type 'glossary'.

As of the 0.1.0 release, QTI 3 Stimulus Player supports the following IS0 639 language codes for keyword translations:

`{ ar | cmn | de | en | es | fr | hmn | it | ja | ko | my | nl | pa | ru | so | tl | uk | vi | yue | zh }`

<p align="right">(<a href="#top">back to top</a>)</p>


### 7. About Dynamic Catalog Rebinding

Under most use-cases, a PNP is passed into QTI 3 Stimulus Player as part of the configuration (see 4b Constructing a Configuration) as an item's XML is loaded.  However, _after an item is loaded_, an encapsulating application may update PNP settings and then force a catalog rebinding with the updated PNP settings.  QTI 3 Stimulus Player implements a `bindCatalog` API method for this use-case.

```js
// 1) Use the PnpFactory helper class to build an updated PNP.
let pnpFactory = new PnpFactory()
// Example: turn off glossary
pnpFactory.setGlossaryOnScreen(false)
// Example: turn on Spanish keyword translations
pnpFactory.setKeywordTranslationLanguage('es')
// Example: turn on ext:sbac-glossary-illustration
pnpFactory.setExtSbacGlossaryIllustration(true)

// 2) Set QTI 3 Stimulus Player's current PNP to our new PNP constructed in 1) above.
this.qti3StimulusPlayer.setStimulusContextPnp(pnpFactory.getPnp())

// 3) Even with a new Stimulus Context PNP (step 2) above, QTI 3 Stimulus Player
//  will not automatically rebind the PNP + Catalog.  
// Force QTI3 Stimulus Player to bind (rebind) the Catalog.
this.qti3StimulusPlayer.bindCatalog()
```

<p align="right">(<a href="#top">back to top</a>)</p>



## QTI 3 Stimulus Player Presentation Attributes

QTI 3 Stimulus Player has several attributes to instrument presentation within an encapsulating application/web page. These attributes are `container-class`, `container-padding-class`, and `color-class`

### container-class

Container classes are used to contain and pad content within them. QTI 3 Stimulus Player comes with built-in support for two container classes: `qti3-player-container-fluid` and `qti3-player-container`.

* qti3-player-container-fluid **DEFAULT**

  This container is a width=100%, padding=0 container at all widths.

* qti3-player-container

  This container has responsive breakpoints at screen widths of 1200px, 980px, and 768px.  


### container-padding-class

Container padding classes are for setting the padding between the QTI 3 Player container and the qti-assessment-item rendered content.  QTI 3 Stimulus Player comes with built-in support for six container padding classes.

* qti3-player-container-padding-0 { padding: 0; } **DEFAULT**
* qti3-player-container-padding-1 { padding: 0.25rem; }
* qti3-player-container-padding-2 { padding: 0.5rem; }
* qti3-player-container-padding-3 { padding: 1rem; }
* qti3-player-container-padding-4 { padding: 1.5rem; }
* qti3-player-container-padding-5 { padding: 3rem; }


### color-class

QTI 3 Stimulus Player has built-in support for 14 foreground / background color combinations in accordance with best practices for many forms of color blindness or other visual impairments.  In addition to setting a colorClass in a PNP, color settings may also be applied dynamically.

* qti3-player-color-default **DEFAULT**
* qti3-player-color-defaultreverse (Default - Reverse Polarity)
* qti3-player-color-blackwhite (High Contrast - foreground color: black, background color: white)
* qti3-player-color-whiteblack (High Contrast - foreground color: white, background color: black)
* qti3-player-color-blackrose (foreground color: black, background color: rose)
* qti3-player-color-roseblack (foreground color: rose, background color: black)
* qti3-player-color-dgraymgray (foreground color: dark gray, background color: medium gray)
* qti3-player-color-mgraydgray (foreground color: medium gray, background color: dark gray)
* qti3-player-color-yellowblue (foreground color: yellow, background color: blue)
* qti3-player-color-blueyellow (foreground color: blue, background color: yellow)
* qti3-player-color-blackcyan (foreground color: black, background color: lblue)
* qti3-player-color-cyanblack (foreground color: lblue, background color: black)
* qti3-player-color-blackcream (foreground color: black, background color: lemonchiffon)
* qti3-player-color-creamblack (foreground color: lemonchiffon, background color: black)


<p align="right">(<a href="#top">back to top</a>)</p>



## Roadmap

The QTI3 Stimulus Player 2023 development roadmap includes the following capabilities:

- [ ] Catalog Support for American Sign Language videos
- [ ] Improved Audio Player
- [ ] Improved Video Player

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



## Built With

The QTI3 Stimulus Player is built with the Vue.js (v2) framework.

* [Vue.js](https://vuejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Paul Grudnitski - paul.grudnitski@amp-up.io

Project Link: [https://github.com/amp-up-io/qti3-stimulus-player](https://github.com/amp-up-io/qti3-stimulus-player)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

This component would not be possible were it not for a fortuitous decision by the aQTI Task Force (the original name of the QTI 3 Working Group) - meeting at CITO headquarters in Arnhem, NE, January 2015 - to make the aQTI / QTI 3 specification "web component friendly".  

<p align="right">(<a href="#top">back to top</a>)</p>


[license-shield]: https://img.shields.io/github/license/amp-up-io/qti3-stimulus-player?label=License&style=for-the-badge
[license-url]: https://github.com/amp-up-io/qti3-stimulus-player/blob/main/LICENSE
