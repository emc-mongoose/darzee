package controllers

import javax.inject.{Inject, Singleton}

import play.api.i18n.MessagesApi
import play.api.mvc.{Action, Controller}

import scala.concurrent.ExecutionContext

/**
 * This controller handles a file upload.
 */
@Singleton
class HomeController @Inject() (implicit val messagesApi: MessagesApi, ec: ExecutionContext)
extends Controller {

  private val logger = org.slf4j.LoggerFactory.getLogger(this.getClass)

  /**
   * Renders a start page.
   */
  def index = Action { implicit request =>
    Ok(views.html.index())
  }

}
