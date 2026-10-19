package com.apps.iatinyfish.presentation.deals

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import com.apps.iatinyfish.ui.theme.IATinyFishTheme
import org.junit.Rule
import org.junit.Test

class DealsAppTest {
    @get:Rule val composeRule = createComposeRule()

    @Test fun startScreenShowsSearchAndSuggestion() {
        composeRule.setContent {
            IATinyFishTheme {
                DealsApp(state = DealsUiState(), onEvent = {})
            }
        }

        composeRule.onNodeWithText("Buscar").assertIsDisplayed()
        composeRule.onNodeWithText("Nintendo Switch OLED").assertIsDisplayed()
    }
}
