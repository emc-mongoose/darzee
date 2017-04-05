name := "console"

version := "0.1.0"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.9"

scalaSource in Compile := baseDirectory.value / "app"

scalaSource in Test := baseDirectory.value / "test"

resolvers += DefaultMavenRepository

libraryDependencies ++= Seq(
  "org.webjars" %% "webjars-play" % "2.5.0",
  "org.webjars" % "requirejs" % "2.3.3",
  "org.webjars" % "w2ui" % "1.5.rc1"
)
