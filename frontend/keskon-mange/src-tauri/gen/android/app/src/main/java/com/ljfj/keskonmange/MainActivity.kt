package com.ljfj.keskonmange

import android.os.Bundle
import android.graphics.Color
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Force the status and nav bars to have solid backgrounds
        window.statusBarColor = android.graphics.Color.parseColor("#fff7ec")
        window.navigationBarColor = android.graphics.Color.parseColor("#fff7ec")

        // 2. Force dark text/icons on the bars (bypasses device dark mode)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.isAppearanceLightStatusBars = true
        controller.isAppearanceLightNavigationBars = true

        // 3. Prevent the app from drawing underneath the system bars
        WindowCompat.setDecorFitsSystemWindows(window, true)
    }
}
