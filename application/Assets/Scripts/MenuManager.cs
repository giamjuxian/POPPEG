using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MenuManager : MonoBehaviour
{
    public GameObject mainPanel;
    public GameObject downloadPanel;
    private bool isDownloadPanel;


    private void Start()
    {
        isDownloadPanel = false;
    }

    /*
     * Toggles between download and main menu panels
     */
    public void ToggleDownloadPanel()
    {
        isDownloadPanel = !isDownloadPanel;
        mainPanel.SetActive(!isDownloadPanel);
        downloadPanel.SetActive(isDownloadPanel);
    }

    /*
     * Loads camera scene using vuforia
     */
    public void LoadCameraScene()
    {
        SceneManager.LoadScene(1);
    }
}
