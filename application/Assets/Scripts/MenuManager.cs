using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuManager : MonoBehaviour
{
    public GameObject mainPanel;
    public GameObject downloadPanel;
    public GameObject instructionsPanel;
    private int panelNumber;


    private void Start()
    {
        panelNumber = 0;
    }

    /*
     * Toggles between download and main menu panels
     */
    public void TogglePanel()
    {
        mainPanel.SetActive(panelNumber == 0);
        downloadPanel.SetActive(panelNumber == 1);
        instructionsPanel.SetActive(panelNumber == 2);
    }

    public void switchToMainPanel()
    {
        panelNumber = 0;
        TogglePanel();
    }

    public void switchToDownloadPanel()
    {
        panelNumber = 1;
        TogglePanel();
    }

    public void switchToInstructionsPanel()
    {
        panelNumber = 2;
        TogglePanel();
    }
}
