<template>
  <section class="test-controller-section">

    <!-- Item Canvas -->
    <main id="main" class="test-controller-container container-fluid">
      <div class="test-controller-content">

        <Qti3StimulusPlayer
          ref="qti3Stimulusplayer"
          :container-class="containerClass"
          :container-padding-class="containerPaddingClass"
          :color-class="colorClass"
          @notifyQti3StimulusPlayerReady="handleStimulusPlayerReady"
          @notifyQti3StimulusReady="handleStimulusReady"
          @notifyQti3StimulusCatalogEvent="handleStimulusCatalogEvent"
        />

      </div>
    </main>

  </section>
</template>

<script>
import { PnpFactory } from '@/shared/helpers/PnpFactory'
import Qti3StimulusPlayer from '@/Qti3StimulusPlayer.vue'

// The Qti3 Item Player built-in CSS
import 'qti3-item-player/dist/qti3Player.css'

export default {
  name: 'StimulusRunner',

  components: {
    Qti3StimulusPlayer,
  },

  data () {
    return {
      id: null,
      identifier: null,
      xml: null,
      /*
       * Qti3StimulusPlayer component instance
       */
      qti3StimulusPlayer: null,
      /*
       * From the set of:
       *   qti3-player-container-fluid ***DEFAULT***
       *   qti3-player-container
       */
      containerClass: 'qti3-player-container-fluid',
      /*
       * From the set of:
       *   qti3-player-color-default ***DEFAULT***
       *   qti3-player-color-defaultreverse (Default - Reverse Polarity)
       *   qti3-player-color-blackwhite (High Contrast)
       *   qti3-player-color-whiteblack (High Contrast - Reverse Polarity)
       *   qti3-player-color-blackrose
       *   qti3-player-color-roseblack
       *   qti3-player-color-yellowblue
       *   qti3-player-color-blueyellow
       *   qti3-player-color-dgraymgray
       *   qti3-player-color-mgraydgray
       *   qti3-player-color-blackcyan
       *   qti3-player-color-cyanblack
       *   qti3-player-color-blackcream
       *   qti3-player-color-creamblack
       */
      colorClass: 'qti3-player-color-default',
      /*
       * From the set of:
       *   qti3-player-container-padding-0 { padding: 0; } ***DEFAULT***
       *   qti3-player-container-padding-1 { padding: 0.25rem; }
       *   qti3-player-container-padding-2 { padding: 0.5rem; }
       *   qti3-player-container-padding-3 { padding: 1rem; }
       *   qti3-player-container-padding-4 { padding: 1.5rem; }
       *   qti3-player-container-padding-5 { padding: 3rem; }
       */
      containerPaddingClass: 'qti3-player-container-padding-2',
      /*
       * Not used
       */
      sessionControl: null,
      /*
       * Test's Pnp Factory
       */
      pnp: null
    }
  },

  methods: {

    initialize () {
      // Load pnp
      this.pnp = new PnpFactory()
      // Load the item
      this.loadStimulus(this.id)
    },

    loadStimulus (id) {
      if (this.xml === null) return

      // Build a configuration
      const configuration = this.getConfiguration(id)

      // Load the stimulus with the configuration
      this.qti3StimulusPlayer.loadStimulusFromXml(this.xml, configuration)
    },

    getConfiguration (guid) {
      const configuration = {}

      configuration.guid = guid
      configuration.pnp = this.pnp.getPnp()
      configuration.sessionControl = null

      return configuration
    },

    /**
     * @description Handle color click events from the Settings menu.
     * Side effect: sets the PNP when a color setting is clicked.
     * @param {String} colorClass - the menu setting that was clicked.
     */
    handleMenuColorClick (colorClass) {
      if (colorClass === null) return
      // Update UI immediately
      this.qti3StimulusPlayer.cssColorClass = this.colorClass = colorClass
      // Set pnp to this textAppearance color style
      this.pnp.setColorStyle(colorClass)
    },

    /**
     * @description Handle container click events from the Settings menu.
     * @param {String} containerClass - the menu setting that was clicked.
     */
    handleMenuContainerClick (containerClass) {
      if (containerClass === null) return
      // Update UI immediately
      this.qti3StimulusPlayer.cssContainerClass = this.containerClass = containerClass
    },

    /**
     * @description Handle container padding click events from the Settings menu.
     * @param {String} containerPaddingClass - the menu setting that was clicked.
     */
    handleMenuContainerPaddingClick (containerPaddingClass) {
      if (containerPaddingClass === null) return
      this.qti3StimulusPlayer.cssContainerPaddingClass = this.containerPaddingClass = containerPaddingClass
    },

    /**
     * @description Handle ad-hoc pnp support click events from the
     * Settings menu component.
     * @param {String} pnpEvent - examples:
     *                            'glossary-off', // turn off glossary
     *                            'ktlang:es', // turn on Spanish translations
     *                            'sbacGlossaryIllustration-on'
     */
    handlePnpChange (pnpEvent) {
      // The evaluatePnpEvent method returns true if we can
      // identify the event AND the event causes a change in
      // the current Pnp that should trigger a catalog rebind.
      if (!this.pnp.evaluatePnpEvent(pnpEvent)) return
      // 1) Set the QTI3 Stimulus Player pnp with our updated pnp.
      this.qti3StimulusPlayer.setItemContextPnp(this.pnp.getPnp())
      // 2) Force QTI3 Stimulus Player to bind the Catalog.
      this.qti3StimulusPlayer.bindCatalog()
    },

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
     *     ... additional supports in catalog based on PNP ...
     *   ]
     * }
     */
    handleStimulusCatalogEvent (event) {
      console.log('[StimulusCatalogEvent][Type: ' + event.type + ']', event)
    },

    /**
     * @description Event handler for the QTI3StimulusPlayer component's 'notifyQti3StimulusPlayerReady'
     * event.  This event is fired upon mounting of the Qti3StimulusPlayer component.
     *
     * The Qti3StimulusPlayer is now ready for XML loading.
     * @param {Component} qti3StimulusPlayer - the Qti3StimulusPlayer component itself
     */
    handleStimulusPlayerReady (qti3StimulusPlayer) {
      this.qti3StimulusPlayer = qti3StimulusPlayer
    },

    /**
     * @description Event handler for the QTI3StimulusPlayer component's 'notifyQti3StimulusReady'
     * event.  This event is fired upon completion of the qti-assessment-stimulus
     * component's loading of XML.
     */
     handleStimulusReady (param) {
       console.log('[Qti3StimulusPlayer][QtiStimulusReady][Identifier]', param.identifier)
     },

    getAppContext () {
      console.log("Vue.prototype.$VUE_APP_CONTEXT", this.$VUE_APP_CONTEXT);
      if (this.$VUE_APP_CONTEXT === null) {
        this.xml = null
        this.id = null
        this.identifier = null
        return
      }

      const context = this.$VUE_APP_CONTEXT
      this.xml = context?.summary?.xml || ''
      this.id = context?.summary?.id || '0'
      this.identifier = context?.summary?.identifier || ''
    }

  },

  created () {
    this.getAppContext()
  },

  mounted () {
    this.initialize()
  }
}
</script>

<style>
*,
*::before,
*::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

:root {
  --blue: #3d8ef8;
  --indigo: #564ab1;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #fb4d53;
  --orange: #f1734f;
  --yellow: #f1b44c;
  --green: #11c46e;
  --teal: #008080;
  --cyan: #0db4d6;
  --rose: #ffd0ff;
  --white: #fff;
  --gray: #7c8a96;
  --gray-dark: #343a40;
  --primary: #3d8ef8;
  --success: #11c46e;
  --info: #0db4d6;
  --warning: #f1b44c;
  --danger: #fb4d53;
  --light: #eff2f7;
  --dark: #343a40;
  --darker: #212529;
  --black: #000;
}

body {
  margin: 0;
  padding: 0;
}

section.test-controller-section {
  display: -webkit-flex;
  display: flex;
  /* Set flex axis to vertical */
  flex-direction: column;
  /* Height = viewport height */
  min-height: 100vh;
}

main.test-controller-container {
  flex: 1 1 auto;
  overflow: auto;
  min-height: 100vh;
  width: 100%;
  padding: 0;
}

/* Inner item panel */
.test-controller-content {
  margin: 0;
}

</style>
