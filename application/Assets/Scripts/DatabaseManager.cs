using System;
using System.Collections.Generic;
using UnityEngine;
using Firebase;
using Firebase.Unity.Editor;
using Firebase.Database;
using Firebase.Storage;
using System.Threading.Tasks;
using System.Threading;
using System.Collections;
using System.IO;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class DatabaseManager : MonoBehaviour
{
    public GameObject downloadButton;
    public GameObject backButton;
    public GameObject textField;
    public GameObject warningTextField;
    private List<Entry> allEntries;
    private FirebaseStorage storage;
    private StorageReference storage_ref;
    private int downloadsRunning = 0;
    private string dotText = "";
    private int nextUpdate = 1;
    private bool isDownloading;
    private Text warningText;

    void Awake()
    {
        DontDestroyOnLoad(this.gameObject);
    }

    void Start()
    {
        warningText = warningTextField.GetComponentInChildren<Text>();
        isDownloading = false;
        allEntries = new List<Entry>();
        FirebaseApp.DefaultInstance.SetEditorDatabaseUrl("https://poppeg-95e96.firebaseio.com/");
        DatabaseReference reference = FirebaseDatabase.DefaultInstance.RootReference;
        storage = FirebaseStorage.DefaultInstance;
        storage_ref = storage.GetReferenceFromUrl("gs://poppeg-95e96.appspot.com");
    }

    void FixedUpdate()
    {
        if (downloadsRunning > 0)
        {
            isDownloading = true;
            ShowDownloading();
        }

        if (downloadsRunning <= 0)
        {
            if (isDownloading)
            {
                ShowDownloadSucceed();
            }
        }
    }

    /*
     * Downloads all videos from the indicated album name.
     * If album name does not exist, warning message is shown.
     */
    public void DownloadVideosFromAlbum()
    {
        downloadButton.GetComponentInChildren<Text>().text = "Starting Download...";
        string albumName = GameObject.Find("BookName").GetComponent<Text>().text;
        Debug.Log("Starting download for " + albumName);
        if (!string.IsNullOrEmpty(albumName))
        {
            FirebaseDatabase.DefaultInstance.RootReference.Child("targets").GetValueAsync().ContinueWith(task =>
            {
                if (task.IsFaulted)
                {
                    downloadButton.GetComponentInChildren<Text>().text = "Download";
                    warningText.text = "Error occured. Please try again";
                    warningText.color = Color.red;
                    warningTextField.SetActive(true);
                    downloadButton.GetComponentInChildren<Text>().text = "Download";
                }
                else if (task.IsCompleted)
                {
                    DataSnapshot snapshot = task.Result;
                    if (snapshot.HasChild(albumName))
                    {
                        DataSnapshot entries = snapshot.Child(albumName).Child("entries");
                        foreach (DataSnapshot entry in entries.Children)
                        {
                            string entryName = entry.Child("name").Value.ToString();
                            string entryURL = entry.Child("url").Value.ToString();
                            allEntries.Add(new Entry(entryName, entryURL));
                        }
                        DownloadVideo();
                        warningTextField.SetActive(false);
                    }
                    else
                    {
                        downloadButton.GetComponentInChildren<Text>().text = "Download";
                        warningText.text = "Album does not exists";
                        warningText.color = Color.red;
                        warningTextField.SetActive(true);
                    }

                }

            });

        }
        else
        {
            downloadButton.GetComponentInChildren<Text>().text = "Download";
            warningText.text = "Please enter an album name";
            warningText.color = Color.red;
            warningTextField.SetActive(true);
        }

    }

    #region Helper Methods

    /* 
     * Retrieves download url from firebase and downloads the video from the url received 
     */
    private void DownloadVideo()
    {
        downloadButton.GetComponentInChildren<Text>().text = "Starting Download...";
        backButton.SetActive(false);
        foreach (Entry e in allEntries)
        {
            Debug.Log("NAME: " + e.GetName() + " URL: " + e.GetUrl());
            string entryUrl = e.GetUrl();
            string entryName = e.GetName();
            StorageReference gs_reference =
                storage.GetReferenceFromUrl("gs://poppeg-95e96.appspot.com/" + entryUrl);

            gs_reference.GetDownloadUrlAsync().ContinueWith((Task<Uri> task) =>
            {
                if (!task.IsFaulted && !task.IsCanceled)
                {
                    Debug.Log("Download URL: " + task.Result);
                    StartCoroutine(DownloadVideoFromURL(task.Result.ToString(), entryName));
                }
            });
        }
    }

    /*
     * Downloads video using the url provided. Video is downloaded as a {{videoName}}.mp4 file
     */
    private IEnumerator DownloadVideoFromURL(string url, string videoName)
    {
        downloadsRunning++;
        var www = new WWW(url);
        yield return www;
        File.WriteAllBytes(Application.persistentDataPath + "/" + videoName + ".mp4", www.bytes);
        Debug.Log("File Saved: " + Application.persistentDataPath + "/" + videoName + ".mp4");
        downloadsRunning--;
    }

    /*
     * Shows successful message for successful download
     */
    private void ShowDownloadSucceed()
    {
        downloadsRunning = 0;
        warningText.text = "Successfully downloaded videos";
        warningText.color = Color.green;
        warningTextField.SetActive(true);

        downloadButton.GetComponentInChildren<Text>().text = "Download";
        backButton.SetActive(true);
        isDownloading = false;
        allEntries.Clear();
    }

    /*
     * Shows indicator that download is in progress
     */
    private void ShowDownloading()
    {
        isDownloading = true;
        UpdateDotText();
        downloadButton.GetComponentInChildren<Text>().text = "Downloading " + downloadsRunning + " videos" + dotText;
        backButton.SetActive(false);
    }

    /*
     * Updates the dot behind the download text
     */
    private void UpdateDotText()
    {
        if (Time.time >= nextUpdate)
        {
            nextUpdate = Mathf.FloorToInt(Time.time) + 1;
            dotText = dotText.Equals("...") ? "" : dotText + ".";
        }
    }
    #endregion

}



class Entry
{
    private string url;
    private string name;

    public Entry(string name, string url)
    {
        this.name = name;
        this.url = url;
    }

    public string GetUrl()
    {
        return url;
    }

    public string GetName()
    {
        return name;
    }
}
