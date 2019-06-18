using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneHandler : MonoBehaviour
{
    /*
     * Loads camera scene using EasyAR
     */
    public void LoadCameraScene()
    {
        SceneManager.LoadScene(1);
    }

    /*
    * Loads camera scene using vuforia
    */
    public void LoadMenuScene()
    {
        SceneManager.LoadScene(0);
    }
}
