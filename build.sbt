name := "console"

version := "0.1.0"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.9"

scalaSource in Compile := baseDirectory.value / "app"

scalaSource in Test := baseDirectory.value / "test"

resolvers += DefaultMavenRepository

libraryDependencies ++= Seq(
	"org.webjars" % "requirejs" % "2.3.3",
	"org.webjars" %% "webjars-play" % "2.5.0-4",
	"org.webjars" % "font-awesome" % "4.7.0",
	"org.webjars.bower" % "dojo" % "1.12.1",
	"org.webjars.bower" % "dijit" % "1.12.1",
	"org.webjars.bower" % "dojox" % "1.12.1", // looks like it's required by gridx
	"org.webjars" % "gridx" % "1.3.9"
)
