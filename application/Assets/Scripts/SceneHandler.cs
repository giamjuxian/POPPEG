using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using System.Runtime.Serialization.Formatters.Binary;
//using UnityEngine.Windows;
using System.IO;


public class SceneHandler : MonoBehaviour
{
    public string sceneID;
    private int x;
    private bool func;
    public int firstTime;
    bool bar = false;
    public Scene MenuScene;
    public Scene OnboardScene;


    public void LoadCameraScene()
    {
        SceneManager.LoadScene(2);
    }


    public void LoadMenuScene()
    {
        SceneManager.LoadScene(1);
        Debug.Log("menu");

    }

    public void LoadOnboardScene()
    {

        SceneManager.LoadScene(0);
        Debug.Log("board");

    }

    private void Awake()
    {

        //Debug.Log("stuck");
        //if (!PlayerPrefs.HasKey("save"))
        //{
        //    PlayerPrefs.SetInt("save", 1);
        //    LoadMenuScene();
        //    //StartCoroutine(CheckScene());
        //    PlayerPrefs.Save();
        //}

        //else
        //{
        //    LoadOnboardScene();
        //}

    }

    private void Start()
    {
        StartCoroutine(CheckScene());
        Debug.Log("start");
    }

    IEnumerator CheckScene()
    {

        if (bar)
        {
            yield return null;
        }
        bar = true;

        firstTime = 1;
        // checks first usage of the app


        if (firstTime == 1)
        {

            PlayerPrefs.SetInt("savedFirstTime", 0);
            SceneManager.SetActiveScene(OnboardScene);
            firstTime = PlayerPrefs.GetInt("savedFirstTime", 1);
            //LoadOnboardScene();

        }
        else
        {
            SceneManager.SetActiveScene(MenuScene);
            //SceneManager.UnloadScene(OnboardScene);
            //LoadMenuScene();
            yield return null;



        }


    }


}


