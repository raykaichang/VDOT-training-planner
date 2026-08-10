plugins {
    id("com.android.application")
}

val generatedWebAssets = layout.buildDirectory.dir("generated/runstrategyAssets")

val syncWebAssets by tasks.registering(Sync::class) {
    group = "build"
    description = "Packages the current website into the Android app without GPX route files."

    from(rootProject.projectDir.parentFile) {
        include("web/**")
        include("src/**")
    }
    from("src/main/web")
    into(generatedWebAssets)
}

android {
    namespace = "tw.runstrategy.app"
    compileSdk = 36
    buildToolsVersion = "36.0.0"

    defaultConfig {
        applicationId = "tw.runstrategy.app"
        minSdk = 23
        targetSdk = 36
        versionCode = 6
        versionName = "1.4.0"
    }

    sourceSets {
        getByName("main").assets.srcDir(generatedWebAssets)
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

tasks.named("preBuild").configure {
    dependsOn(syncWebAssets)
}
