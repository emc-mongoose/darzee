name := "console"

version := "0.1.0"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.9"

scalaSource in Compile := baseDirectory.value / "app"

scalaSource in Test := baseDirectory.value / "test"

resolvers += DefaultMavenRepository
