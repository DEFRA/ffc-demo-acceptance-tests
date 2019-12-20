import Page from './page'
import utl from '../../utilities/common-utilities'

class confirmation extends Page {
  /**
    * define elements
    */
  // get serviceName()           { return $('//.govuk-header__link--service-name'); }
  // get unavailableService()    { return $('.govuk-heading-xl');}
  get applicationComplete () { return $('h1=Application complete') }

  /**
     * define or overwrite page methods
     */
  open () {
    super.open('')
    browser.pause(3000)
  }

  /**
     * your page specific methods
     */
  applicationComplete () {
    this.applicationComplete.waitForDisplayed(1000)
    return this.applicationComplete.isDisplayed()
  }
}

export default new confirmation()
